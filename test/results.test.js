jest.autoMockOff()

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';

const should = chai.should();



import { ResultBox } from '../js/components/results/results';

describe('Search Area Component', function () {
    it('should display the search area', function () {

        const cardNum = 0;
        const testContents = [{
            image: 'http://lorempixel.com/400/200/',
            title: 'test'
        }];
        const testObj = {
            zomatoResults: testContents,
            ebResults: testContents,
            bitResults: testContents,
            movieResults: testContents,
        }

        const renderer = TestUtils.createRenderer();
        renderer.render( <ResultBox results={testObj}> </ResultBox> );
        const result = renderer.getRenderOutput();
        console.log(result);
    })
})