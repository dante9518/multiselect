import { Component, 
         forwardRef, 
         Input, 
         Output, 
         EventEmitter, 
         ViewChild,
         ElementRef,
         HostListener,
         OnChanges,
         ChangeDetectorRef} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { of, fromEvent } from 'rxjs';
import { tap, 
         map, 
         debounceTime, 
         distinctUntilChanged, 
         concatMap} from 'rxjs/operators';


export class ListItem {
  id: string;
  name?: string;
}

@Component({
  selector: 'multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectComponent),
      multi: true
    }
  ]
})

export class MultiselectComponent implements ControlValueAccessor, OnChanges {
  @Input() items: Array<ListItem> = [];
  @Input() selectedItems: Array<ListItem> = [];
  @Input() placeholder: string = '';
  @Input() dataKey: string = '';
  
  @Output() itemSelected = new EventEmitter<ListItem>();
  @Output() itemUnselected = new EventEmitter<ListItem>();

  @ViewChild('multiselect', { static: false }) public multiselect: ElementRef<any>;
  @ViewChild('searchInput', { static: true }) public searchInput: ElementRef<any>;

  public copyItems: any = [];
  public open: boolean = false;
  public disabled: boolean = false;
  public notFound: boolean = false;
  public slicedSelectedItems: Array<ListItem> = [];
  public itemsCounter: number = 0;
  private onChange = (selected: Array<ListItem>, slicedSelected: Array<ListItem>, counter: number) => {};
  private onTouch = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this.multiselect.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.closeDropdown();
      this.onTouch();
    }
  }

  @HostListener('blur')
  public onTouched() {
    this.closeDropdown();
    this.onTouch();
  }

  public ngOnChanges(): void {
    if (this.items !== undefined && this.searchInput !== undefined) {
      this.copyItems = [...this.items];
      this.createStream();
    }
  }

  writeValue(items: Array<ListItem>): void {
    this.selectedItems = items || [];
    this.slicedSelectedItems = this.selectedItems.slice(0, 3);
    this.itemsCounter = this.selectedItems.length - this.slicedSelectedItems.length;
    this.onChange(this.selectedItems, this.slicedSelectedItems, this.itemsCounter);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  trackByFn(index, item) {
    return item.id;
  }

  public createStream() {
    const getItems = keys => this.copyItems.filter(e => e.name.toLowerCase().includes(keys));
    const searchItems = keys => of(getItems(keys));
    const input$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
          tap(() => this.copyItems = [...this.items]),
          map((e: any) => e.target.value.toLowerCase()),
          debounceTime(250),
          distinctUntilChanged(),
          concatMap(searchItems)
        );

    input$.subscribe(e => {
      if(e.length === 0) {
        this.copyItems = e;
        this.notFound = true;
      } else if(this.searchInput.nativeElement.value.length === 0) {
        this.notFound = false;
      } else {
        this.copyItems = e;
        this.notFound = false;
      }
      this.cdr.markForCheck();
    })
  }

  public onItemClick(item: ListItem) {
    if(!this.disabled) {
      const found = this.isItemAlreadySelected(item);
      if(!found) {
        this.select(item);
      } else {
        this.unselect(item);
      }
      this.toSliceItems();
      this.onChange(this.selectedItems, this.slicedSelectedItems, this.itemsCounter);
    }
    event.stopPropagation();
  }

  public isItemAlreadySelected(selectedItem) {
    let found = false;
    this.selectedItems.forEach((item) => {
      if(selectedItem.id === item.id) {
        found = true;
      }
    });
    return found;
  }

  public toSliceItems() {
    this.slicedSelectedItems = this.selectedItems.slice(0, 3);
    this.itemsCounter = this.selectedItems.length - this.slicedSelectedItems.length;
  }

  public select(item) {
    this.selectedItems.push(item);
    this.itemSelected.emit(item);
  }

  public unselect(itemSel) {
    this.selectedItems.forEach((item) => {
      if(itemSel.id === item.id) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this.itemUnselected.emit(itemSel);
  }

  public toggleDropdown() {
    if (!this.disabled) {
      this.open = !this.open;
      this.searchInput.nativeElement.value = null;
      this.copyItems = [...this.items];
      this.notFound = false;
    }
  }

  public closeDropdown() {
    this.open = false;
  }

}
