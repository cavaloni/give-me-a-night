const storeStateMock = {
    clickedBox: {
        resultsBoxNum: 0,
        eventType: 'bitResults'
    },
    eventsToDisplay: [{
        bitResults: {
            image: '../../../assets/img/no-results.png',
            title: 'Small Town?',
            location: undefined,
            description: undefined,
            link: undefined,
            startTime: undefined,
            score: undefined
        },
        ebResults: {
            image: '../../../assets/img/no-results.png',
            title: 'Small Town?',
            location: undefined,
            description: undefined,
            link: undefined,
            startTime: undefined,
            score: undefined
        },
        zomatoResults: {
            image: '../../../assets/img/no-results.png',
            title: 'Small Town?',
            location: undefined,
            description: undefined,
            link: undefined,
            startTime: undefined,
            score: undefined
        },
        movieResults: {
            image: '../../../assets/img/no-results.png',
            title: 'Small Town?',
            location: undefined,
            description: undefined,
            link: undefined,
            startTime: undefined,
            score: undefined
        }
    }],
    cardSideIsFront: false,
    searching: false,
    search: {
        loc: 'Nowhere, Alabama',
        feel: 'Crazy'
    }
};

export default storeStateMock;