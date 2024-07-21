<script lang="ts">
    import { faBox, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';

    import ContentPerformanceChart from './(components)/(content-performance)/content-performance-chart.svelte';
    import UserAcquisitionChart from './(components)/(user-acquisition)/user-acquisition-chart.svelte';
    import KpiCard from './(components)/kpi-card.svelte';
    import TopContentTable from './(components)/top-content-table.svelte';
</script>

<div class="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3" id="admin-home-container">
    <KpiCard icon={faUsers} percentChange={5.2} title="Total Users" value="12.3K" />
    <KpiCard icon={faBox} percentChange={-1.3} title="Total Content" value="3.2K" />
    <KpiCard icon={faChartLine} percentChange={2.1} title="Total Revenue" value="$45.2K" />
    <div class="col-span-full grid grid-cols-1 gap-5 lg:grid-cols-2">
        <UserAcquisitionChart class="h-64" />
        <ContentPerformanceChart class="h-64" />
    </div>
    <TopContentTable class="col-span-full" />
</div>
