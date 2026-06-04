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

                        let replaces = [
                            { match: /features\/iot-control\/types\/building/g, replace: 'features/building-management/types/building' },
                            { match: /features\/iot-control\/data\/buildings-db/g, replace: 'features/building-management/data/buildings-db' },
                            { match: /features\/iot-control\/hooks\/use-buildings/g, replace: 'features/building-management/hooks/use-buildings' },
                            { match: /features\/iot-control\/hooks\/use-building-management-state/g, replace: 'features/building-management/hooks/use-building-management-state' },
                            { match: /\.\.\/\.\.\/iot-control\/hooks\/use-buildings/g, replace: '@/features/building-management/hooks/use-buildings' },
                            { match: /\.\.\/\.\.\/types\/building/g, replace: '@/features/building-management/types/building' },
                            { match: /\.\.\/\.\.\/hooks\/use-building-management-state/g, replace: '@/features/building-management/hooks/use-building-management-state' },
                            { match: /\.\.\/hooks\/use-buildings/g, replace: '@/features/building-management/hooks/use-buildings' },
                            { match: /\.\.\/types\/building/g, replace: '@/features/building-management/types/building' },
                            { match: /\.\.\/views\/building-management-view/g, replace: '@/features/building-management/views/building-management-view' },
                        ];

                        replaces.forEach(r => {
                            if (content.match(r.match)) {
                                content = content.replace(r.match, r.replace);
                                changed = true;
                            }
                        });

                        // Specific local replacements
                        if (!file.includes('building-management') && content.match(/\.\/use-buildings/g)) {
                            content = content.replace(/\.\/use-buildings/g, '@/features/building-management/hooks/use-buildings');
                            changed = true;
                        }

                        if (!file.includes('building-management') && content.match(/\.\/types\/building/g)) {
                            content = content.replace(/\.\/types\/building/g, '@/features/building-management/types/building');
                            changed = true;
                        }

                        if (!file.includes('building-management') && content.match(/\.\/views\/building-management-view/g)) {
                            content = content.replace(/\.\/views\/building-management-view/g, '@/features/building-management/views/building-management-view');
                            changed = true;
                        }

                        if (changed) {
                            fs.writeFileSync(file, content, 'utf8');
                            console.log('Fixed:', file);
                        }
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

walk('./src', (err) => { if(err) console.error(err); else console.log('Done'); });
