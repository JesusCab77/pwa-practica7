const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';



self.addEventListener('install', (event)=>{
    console.log('SW: instalado');
    console.log(event.request.url);
    //guardar cache de rutas estáticas, las cuales no cambian
    const respCache = caches.open(STATIC_CACHE_NAME).then((cache)=>{
        return cache.addAll([
            '/',
            '/index.html',
            '/js/app.js',
            '/manifest.json',
            'https://img.freepik.com/foto-gratis/lindo-perrito-haciendose-pasar-persona-negocios_23-2148985938.jpg',
        ]);
        
    });
    //Rutas inmutables (que son CDN, o recursos que usamos)
    const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME)
        .then((cache)=>{
            return cache.addAll([

                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js',
                    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
                    'http://localhost:8080/images/icons/android-launchericon-144-144.png'
                ]);
        });
    
    event.waitUntil(Promise.all[respCache, respCacheInmutable]); //espera a que se terminen de crear esos dos caches.



});

//primero intento siempre ir a la web y si no cache
self.addEventListener('fetch', (event)=>{
    console.log(event.request.url);

    const resp = fetch(event.request).then((respWeb)=>{
        if(!respWeb.ok){
            
            return caches.match(event.request)
              
        }

        caches.open(DYNAMIC_CACHE_NAME).then((cacheDynamic)=>{
            cacheDynamic.put(event.request, respWeb)
        })

        return respWeb.clone();
    }).catch(()=>{
        return caches.match(event.request)
    })

    event.respondWith(resp);
})

