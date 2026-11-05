import { build } from 'vite';
import { spawnSync } from 'node:child_process';
const names=process.argv.slice(2);
for(const name of names){
  if(!/^[a-z-]+$/.test(name))throw new Error('Invalid test name');
  await build({configFile:false,logLevel:'error',build:{ssr:`tools/tests/${name}.ts`,outDir:'.checks',emptyOutDir:false,rollupOptions:{output:{entryFileNames:`${name}.mjs`}}}});
  const run=spawnSync(process.execPath,[`.checks/${name}.mjs`],{stdio:'inherit'});
  if(run.status!==0)process.exit(run.status??1);
}
