import test from 'ava';

import Timeline from '../dist/Timeline';
import index from '../dist/index';

test( 'it has the timeline as the default data', t => {
    t.is( index, Timeline );
} );
