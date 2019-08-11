/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-11 09:55:56
 * @LastEditTime: 2019-08-11 14:25:29
 * @LastEditors: Please set LastEditors
 */
/**
 * @file main.js
 * @author huanghuiquan
 */

define(function (require) {
    'use strict';
    let axios = require('axios');
    let render = require('./render');
    let ui = require('./ui')

    // 异步请求数据，并在前端渲染
    axios.get('/api/movies').then(function (response) {
        let $movieList = document.querySelector('.movie-list');

        if (response.status !== 200) {
            $movieList.innerHTML = '网络错误';
            return;
        }
        $movieList.innerHTML = render(response.data);
    });

    // 注册serviceWorker
    //Navigator 接口表示用户代理的状态和标识。 它允许脚本查询它和注册自己进行一些活动
    window.addEventListener('load', function(event){
        if('serviceWorker' in window.navigator){
            navigator.serviceWorker.register('sw.js', {scope: '/'}).then(function(registeration){
                console.log('Service worker register start with:', registeration.scope)
            })

            navigator.serviceWorker.oncontrollerchange = function(event){
                ui.showToast('页面已更新', 'info')
            }
            // 判断是否联网
            if(this.navigator.onLine){
                ui.showToast('网络已断开,内容可能过期', 'warning')
                window.addEventListener('online', function (event) {
                    ui.showToast('网络已连接，刷新获取最新内容', 'info')
                })
            }
        }
    })
});
