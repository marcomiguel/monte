import reducer from '../reducer';

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

describe('list interplay', () => {
    it('return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });
});
