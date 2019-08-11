/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-11 09:22:55
 * @LastEditTime: 2019-08-11 09:22:55
 * @LastEditors: your name
 */
/**
 * @file render.js
 * @author huanghuiquan
 */

define(function (require) {
    'use strict';

    return function (data) {
        let html = data.subjects.map(function (subject) {
            return `
            <li>
                <img src="${subject.pic}"/>
                <p>${subject.title}</p>
            </li>
            `;
        }).join('');
        return html;
    };
});
