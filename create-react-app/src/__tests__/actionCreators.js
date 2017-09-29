import { changeViewMode } from '../actionCreators';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const CHANGE_VIEW_MODE = 'CHANGE_VIEW_MODE';
const initialState = {
    list: {
        status: 0,
        data: [],
        last_cursor: ''
    },
    assign: {

    },
    mode_view: 0,
    selected: []
};

const finalState = {
    list: {
        status: 0,
        data: [],
        last_cursor: ''
    },
    assign: {

    },
    mode_view: 1,
    selected: []
};

it('change view mode', () => {
    const store = mockStore({ initialState });
    store.dispatch(changeViewMode());

    const actions = store.getActions();
    const state = store.getState();

    expect(state).toEqual({ finalState });
    expect(actions.length).toBe(1);
    expect(actions[0].type).toBe(CHANGE_VIEW_MODE);
})