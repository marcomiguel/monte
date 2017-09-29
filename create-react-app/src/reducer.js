const LIST_INTERPLAY = 'LIST_INTERPLAY';
const LIST_INTERPLAY_SUCCESS = 'LIST_INTERPLAY_SUCCESS';
const LIST_INTERPLAY_FAIL = 'LIST_INTERPLAY_FAIL';
const CHANGE_VIEW_MODE = 'CHANGE_VIEW_MODE';

const initialState = {
    list: {
        status: 0, /*0:init 1:loading 2:loaded 3:fail*/
        data: [],
        last_cursor: ''
    },
    assign: {

    },
    mode_view: 0, // component = 0, list = 1
    selected: []
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LIST_INTERPLAY:
            return {...state, list: { status: 1, data: [] }};
        case LIST_INTERPLAY_SUCCESS:
            return {...state, list: { status: 2, data: action.result.response, last_cursor: action.result.last_cursor }};
        case LIST_INTERPLAY_FAIL:
            return {...state, list: { status: 3}};
        case CHANGE_VIEW_MODE:
            return {...state, mode_view: !state.mode_view }
        
        default:
            return {...state};
    }
}