const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        let pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err) {
                        if (!--pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                        let content = fs.readFileSync(file, 'utf8');
                        let changed = false;

                        // Fix auth module
                        if (content.match(/\.\.\/\.\.\/iot-control\/types\/building/g)) {
                            content = content.replace(/\.\.\/\.\.\/iot-control\/types\/building/g, '@/features/building-management/types/building');
                            changed = true;
                        }
                        if (content.match(/\.\.\/\.\.\/\.\.\/iot-control\/types\/building/g)) {
                            content = content.replace(/\.\.\/\.\.\/\.\.\/iot-control\/types\/building/g, '@/features/building-management/types/building');
                            changed = true;
                        }
                        if (content.match(/\.\.\/iot-control\/data\/buildings-db/g)) {
                            content = content.replace(/\.\.\/iot-control\/data\/buildings-db/g, '@/features/building-management/data/buildings-db');
                            changed = true;
                        }

                        // Fix bad replacements like ../@/features
                        if (content.match(/\.\.\/@\/features/g)) {
                            content = content.replace(/\.\.\/@\/features/g, '@/features');
                            changed = true;
                        }
                        if (content.match(/\.\.\/\.\.\/@\/features/g)) {
                            content = content.replace(/\.\.\/\.\.\/@\/features/g, '@/features');
                            changed = true;
                        }

                        // Fix views path inside building-management
                        if (file.includes('building-management-view.tsx')) {
                            if (content.match(/\.\.\/components\/building-management\//g)) {
                                content = content.replace(/\.\.\/components\/building-management\//g, '../components/');
                                changed = true;
                            }
                        }

                        // Fix index.ts in iot-control
                        if (file.endsWith('iot-control\\index.ts') || file.endsWith('iot-control/index.ts')) {
                            if (content.match(/\.\/hooks\/use-buildings/g)) {
                                content = content.replace(/\.\/hooks\/use-buildings/g, '@/features/building-management/hooks/use-buildings');
                                changed = true;
                            }
                        }

                        if (changed) {
                            fs.writeFileSync(file, content, 'utf8');
                        }
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

walk('./src', (err) => { if(err) console.error(err); else console.log('Done 2'); });
