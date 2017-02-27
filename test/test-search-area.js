import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';

const should = chai.should();

import SearchArea from '../js/components/search-area/search-area';

describe('Search Area Component', function () { 
    it('should display the search area', function () { 
        const renderer = TestUtils.createRenderer();
        renderer.render(<SearchArea />);
        const result = renderer.getRenderOutput();
     })
 })