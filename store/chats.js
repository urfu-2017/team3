'use strict';

let initialState = [
    {
        id: '5ae717583575fc2688d32744',
        title: 'ArtyMgn',
        avatar: 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgyMTcsMzgsNzIsMSk7IHN0cm9rZTpyZ2JhKDIxNywzOCw3MiwxKTsgc3Ryb2tlLXdpZHRoOjAuNTsnPjxyZWN0ICB4PScyNicgeT0nMTAnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nMTAnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScyNicgeT0nMjYnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nMjYnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScyNicgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScyNicgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc1OCcgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScxMCcgeT0nNDInIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc3NCcgeT0nNDInIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScxMCcgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc3NCcgeT0nNTgnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PScxMCcgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjxyZWN0ICB4PSc3NCcgeT0nNzQnIHdpZHRoPScxNicgaGVpZ2h0PScxNicvPjwvZz48L3N2Zz4=',
        members: ['spt30', 'ArtyMgn'],
        lastMessage: '',
        date: '1447857230137'
    }
];

export default function chats(state = initialState, action) {
    if (action.type === 'LOAD_CHATS') {
        console.info(1213123123);
        return action.chats;
    }

    return state;
}
