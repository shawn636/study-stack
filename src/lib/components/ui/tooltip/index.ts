import Content from './tooltip-content.svelte';
import { Tooltip as TooltipPrimitive } from 'bits-ui';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Root = TooltipPrimitive.Root;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Trigger = TooltipPrimitive.Trigger;

export {
    Root,
    Trigger,
    Content,
    //
    Root as Tooltip,
    Content as TooltipContent,
    Trigger as TooltipTrigger
};
