import { Dialog as SheetPrimitive } from 'bits-ui';
import { type VariantProps, tv } from 'tailwind-variants';

import Content from './sheet-content.svelte';
import Description from './sheet-description.svelte';
import Footer from './sheet-footer.svelte';
import Header from './sheet-header.svelte';
import Overlay from './sheet-overlay.svelte';
import Portal from './sheet-portal.svelte';
import Title from './sheet-title.svelte';

const Root = SheetPrimitive.Root;
const Close = SheetPrimitive.Close;
const Trigger = SheetPrimitive.Trigger;

export {
    Close,
    Close as SheetClose,
    Content,
    Content as SheetContent,
    Description,
    Description as SheetDescription,
    Footer,
    Footer as SheetFooter,
    Header,
    Header as SheetHeader,
    Overlay,
    Overlay as SheetOverlay,
    Portal,
    Portal as SheetPortal,
    Root,
    //
    Root as Sheet,
    Title,
    Title as SheetTitle,
    Trigger,
    Trigger as SheetTrigger
};

export const sheetVariants = tv({
    base: 'fixed z-50 gap-4 bg-background p-6 shadow-lg',
    defaultVariants: {
        side: 'right'
    },
    variants: {
        side: {
            bottom: 'inset-x-0 bottom-0 border-t',
            left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            right: 'inset-y-0 right-0 h-full w-3/4  border-l sm:max-w-sm',
            top: 'inset-x-0 top-0 border-b'
        }
    }
});

export const sheetTransitions = {
    bottom: {
        in: {
            duration: 500,
            opacity: 1,
            y: '100%'
        },
        out: {
            duration: 300,
            opacity: 1,
            y: '100%'
        }
    },
    left: {
        in: {
            duration: 500,
            opacity: 1,
            x: '-100%'
        },
        out: {
            duration: 300,
            opacity: 1,
            x: '-100%'
        }
    },
    right: {
        in: {
            duration: 500,
            opacity: 1,
            x: '100%'
        },
        out: {
            duration: 300,
            opacity: 1,
            x: '100%'
        }
    },
    top: {
        in: {
            duration: 500,
            opacity: 1,
            y: '-100%'
        },
        out: {
            duration: 300,
            opacity: 1,
            y: '-100%'
        }
    }
};

export type Side = VariantProps<typeof sheetVariants>['side'];
