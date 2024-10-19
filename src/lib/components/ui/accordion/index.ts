import { Accordion as AccordionPrimitive } from 'bits-ui';

import Content from './accordion-content.svelte';
import Item from './accordion-item.svelte';
import Trigger from './accordion-trigger.svelte';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Root = AccordionPrimitive.Root;

export {
    Content,
    Content as AccordionContent,
    Item,
    Item as AccordionItem,
    Root,
    //
    Root as Accordion,
    Trigger,
    Trigger as AccordionTrigger
};
