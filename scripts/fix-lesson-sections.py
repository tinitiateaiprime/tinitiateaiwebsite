"""Repair stale lesson TOC links against the reviewed section inventory."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'public/masterclasses'
repairs={
 'pyspark/cloud-storage.html': {'#sec-partition-layout':'#sec-cloud-selector'},
 'pyspark/dag-execution.html': {'#sec-dag-visualizer':'#sec-dag-simulator','#sec-narrow-wide-ops':'#sec-dag-transformations','#sec-catalyst-optimizer':'#sec-dag-explain'},
 'pyspark/index.html': {'#sec-step-7':'/masterclasses/pyspark/streaming-cdc.html','#sec-ingestion-matrix':'#sec-matrix'},
 'pyspark/mpp-warehouses.html': {'#sec-mpp-simulator':'#sec-mpp-sim','#sec-staging-flow':'#sec-mpp-arch','#sec-arrow-flight':'#sec-mpp-pushdown'},
 'pyspark/rdbms-jdbc.html': {'#sec-jdbc-simulator':'#sec-jdbc-sim','#sec-partition-columns':'#sec-jdbc-dialects','#sec-db-connection-pool':'#sec-jdbc-trap'},
 'pyspark/shuffle-partitioning.html': {'#sec-scheduling-pipeline':'#sec-anatomy','#sec-ingestion-dashboard':'#sec-50row-simulator','#sec-shuffle-network':'#sec-shuffle-mechanics','#sec-df-dag-studio':'/masterclasses/pyspark/dag-execution.html#sec-dag-simulator','#sec-skew-mitigation':'#sec-fixes'},
 'automation-ml-ai-agentic/ai.html': {f'#domain-{name}':f'#pane-{name}' for name in ['social','finance','realestate','retail','logistics']},
}
for name,mapping in repairs.items():
 path=root/name
 source=path.read_text(encoding='utf-8')
 for old,new in mapping.items(): source=source.replace('href="'+old+'"','href="'+new+'"')
 if name=='pyspark/cloud-storage.html': source=source.replace('<span>Hive Directory Partitioning</span>','<span>Storage Configuration &amp; Layouts</span>')
 if name=='pyspark/mpp-warehouses.html': source=source.replace('<span>Arrow Flight High-Throughput</span>','<span>Predicate Pushdown</span>')
 if name=='pyspark/rdbms-jdbc.html': source=source.replace('<span>Partition Column Selection</span>','<span>Database Dialects &amp; Configuration</span>').replace('<span>Connection Pool Saturation</span>','<span>The Single-Connection Trap</span>')
 path.write_text(source,encoding='utf-8',newline='')
print('Reviewed section navigation repaired in',len(repairs),'pages.')
