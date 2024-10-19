import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

import CheckboxItem from './dropdown-menu-checkbox-item.svelte';
import Content from './dropdown-menu-content.svelte';
import Item from './dropdown-menu-item.svelte';
import Label from './dropdown-menu-label.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Shortcut from './dropdown-menu-shortcut.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Sub = DropdownMenuPrimitive.Sub;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Root = DropdownMenuPrimitive.Root;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Trigger = DropdownMenuPrimitive.Trigger;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Group = DropdownMenuPrimitive.Group;

export {
    CheckboxItem,
    CheckboxItem as DropdownMenuCheckboxItem,
    Content,
    Content as DropdownMenuContent,
    Group,
    Group as DropdownMenuGroup,
    Item,
    Item as DropdownMenuItem,
    Label,
    Label as DropdownMenuLabel,
    RadioGroup,
    RadioGroup as DropdownMenuRadioGroup,
    RadioItem,
    RadioItem as DropdownMenuRadioItem,
    Root,
    //
    Root as DropdownMenu,
    Separator,
    Separator as DropdownMenuSeparator,
    Shortcut,
    Shortcut as DropdownMenuShortcut,
    Sub,
    Sub as DropdownMenuSub,
    SubContent,
    SubContent as DropdownMenuSubContent,
    SubTrigger,
    SubTrigger as DropdownMenuSubTrigger,
    Trigger,
    Trigger as DropdownMenuTrigger
};
