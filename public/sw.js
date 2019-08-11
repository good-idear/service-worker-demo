/*
 * @Description: In User Settings Edit
 * @Author: good-idear
 * @Date: 2019-08-11 09:57:12
 * @LastEditTime: 2019-08-11 14:45:30
 * @LastEditors: Please set LastEditors
 */

let CACHE_VERSION = '0'
let CACHE_NAME = 'cache' + CACHE_VERSION
// 确定需要请求的资源列表
let CACHE_URLS = [
    '/',
    '/js/main.js',
    '/api/movies',
    '/js/render.js',
    '/js/ui.js',
    '/css/main.css',
    '/img/logo.png'
]

// 预缓存
function precache() {
    return caches
        .open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(CACHE_URLS)
        })
}

// 删除过期缓存
function clearCache() {
    console.log(caches.keys())
    return caches.keys().then(keys => { 
        keys.forEach(key => {
            if(key !== CACHE_NAME){
                caches.delete(key)
            }
        })
    })
}
// 安装完进行缓存
self.addEventListener('install', function(event){
    event.waitUntil(
        precache().then(self.skipWaiting)
    )
})

// 阶段清除缓存
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            clearCache(),
            self.clients.claim()
        ])
    )
})

function fetchAndCache(req) {
    return fetch(req).then(function (res) {
        saveToCache(req, res.clone())
        return res
    })
}

function saveToCache(req, res) {
    return caches
        .open(CACHE_NAME)
        .then(cache => cache.put(req, res))
}

// fetch可以发送请求和响应，在这里作用监听fetch请求
// 刷新页面，就可以打印出相应资源资源请求的url
self.addEventListener('fetch', function(event){
    // 只对同源的资源进行serviceWorker
    let url = new URL(event.request.url)
    if(url.origin !== self.origin){
        return
    }
    // 对经常更新的api，需要取上一次的缓存而不是安装时候的缓存
    if(event.request.url.includes('/api/movies')){
        event.respondWith(
            fetchAndCache(event.request).catch(function(){
                return caches.match(event.request)
            })
        )
        return
    }
    // 优先从服务器请求，如果断网的话就从cache中获取
    event.respondWith(
        fetch(event.request).catch(function(){
            return caches.match(event.request)
        })
    )
})