'use strict';

import React from 'react';

import ChatIcon from '../common-components/ChatIcon';

import './Chats.css';

export default function Chats({ chatsList, clickToOpenChat }) {
    if (!chatsList) {
        chatsList = [
            {
                id: 1,
                title: 'andrewnosov',
                avatar:
                    'PHN2ZyB4bWxucz0n' +
                    'aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAn' +
                    'IGhlaWdodD0nMTAwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2J' +
                    'hKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgzOCw' +
                    'yMTcsMjE1LDEpOyBzdHJva2U6cmdiYSgzOCwyMTcsMjE1LDEpOyBzdHJ' +
                    'va2Utd2lkdGg6MC41Oyc+PHJlY3QgIHg9JzQyJyB5PScyNicgd2lkdGg9' +
                    'JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzQyJyB5PSc0Micgd2lkdG' +
                    'g9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzQyJyB5PSc3NCcgd2lk' +
                    'dGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzI2JyB5PSc1OCcgd2l' +
                    'kdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzU4JyB5PSc1OCcgd2' +
                    'lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PScyNicgd' +
                    '2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PScyNicgd' +
                    '2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc0Micg' +
                    'd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc0Micg' +
                    'd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc1OCc' +
                    'gd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc1OC' +
                    'cgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc3N' +
                    'Ccgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc3' +
                    'NCcgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9nPjwvc3ZnPg==',
                members: ['14900963', '12300983'],
                lastMessage: 'Сколько бы тогда не было',
                date: '1447857230137'
            },
            {
                id: 2,
                title: 'spt30',
                avatar:
                    'PHN2ZyB4bWxucz0n' +
                    'aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAn' +
                    'IGhlaWdodD0nMTAwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2J' +
                    'hKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgzOCw' +
                    'yMTcsMjE1LDEpOyBzdHJva2U6cmdiYSgzOCwyMTcsMjE1LDEpOyBzdHJ' +
                    'va2Utd2lkdGg6MC41Oyc+PHJlY3QgIHg9JzQyJyB5PScyNicgd2lkdGg9' +
                    'JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzQyJyB5PSc0Micgd2lkdG' +
                    'g9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzQyJyB5PSc3NCcgd2lk' +
                    'dGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzI2JyB5PSc1OCcgd2l' +
                    'kdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzU4JyB5PSc1OCcgd2' +
                    'lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PScyNicgd' +
                    '2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PScyNicgd' +
                    '2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc0Micg' +
                    'd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc0Micg' +
                    'd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc1OCc' +
                    'gd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc1OC' +
                    'cgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9JzEwJyB5PSc3N' +
                    'Ccgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PHJlY3QgIHg9Jzc0JyB5PSc3' +
                    'NCcgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9nPjwvc3ZnPg==',
                members: ['14900963', '30200032'],
                lastMessage: 'как и тогда',
                date: '1447857230137'
            },
            {
                id: '5ae717583575fc2688d32744',
                title: 'ArtyMgn',
                avatar:
                    'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgyMTcsMzgsNzIsMSk7IHN0cm9rZTpyZ2JhKDIxNywzOCw3MiwxKTsgc3Ryb2tlLXdpZHRoOjAuNTsnPjxyZWN0ICB4PScyNicgeT0nMTAnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nMTAnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScyNicgeT0nMjYnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nMjYnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScyNicgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScyNicgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScxMCcgeT0nNDInIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc3NCcgeT0nNDInIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScxMCcgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc3NCcgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScxMCcgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc3NCcgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjwvZz48L3N2Zz4=',
                members: ['spt30', 'ArtyMgn'],
                lastMessage: '',
                date: '1447857230137'
            }
        ];
    }

    return chatsList.map(chat => (
        <ChatIcon key={chat.id} chatProps={chat} clickToOpenChat={clickToOpenChat} />
    ));
}
