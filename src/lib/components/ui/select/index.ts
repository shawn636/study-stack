import { Select as SelectPrimitive } from 'bits-ui';

import Content from './select-content.svelte';
import Item from './select-item.svelte';
import Label from './select-label.svelte';
import Separator from './select-separator.svelte';
import Trigger from './select-trigger.svelte';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Root = SelectPrimitive.Root;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Group = SelectPrimitive.Group;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Input = SelectPrimitive.Input;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Value = SelectPrimitive.Value;

export {
    Content,
    Content as SelectContent,
    Group,
    Group as SelectGroup,
    Input,
    Input as SelectInput,
    Item,
    Item as SelectItem,
    Label,
    Label as SelectLabel,
    Root,
    //
    Root as Select,
    Separator,
    Separator as SelectSeparator,
    Trigger,
    Trigger as SelectTrigger,
    Value,
    Value as SelectValue
};
