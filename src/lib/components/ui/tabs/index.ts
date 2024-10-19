import Content from './tabs-content.svelte';
import List from './tabs-list.svelte';
import { Tabs as TabsPrimitive } from 'bits-ui';
import Trigger from './tabs-trigger.svelte';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Root = TabsPrimitive.Root;

export {
    Root,
    Content,
    List,
    Trigger,
    //
    Root as Tabs,
    Content as TabsContent,
    List as TabsList,
    Trigger as TabsTrigger
};
