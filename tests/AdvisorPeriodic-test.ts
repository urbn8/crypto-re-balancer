import * as tape from "tape"

import { AdvisorPeriodic } from '../src/common/AdvisorPeriodic'
import { oneHourInMilliseconds } from '../src/common/intervalPresets'

tape("Advisor#update", function (t: tape.Test) {
    t.test("given kickoffDelay = 0", function (t: tape.Test) {
        t.plan(1)

        // given kickoffDelay = 0
        const advisor = new AdvisorPeriodic(
            oneHourInMilliseconds,
            0,
        )

        // it should rebalance right away
        const advice = advisor.update({
            "openTime" : 1511146800000.0, 
            "open" : "36.00000000", 
            "high" : "46.00000000", 
            "low" : "36.00000000", 
            "close" : "42.40000000", 
            "volume" : "601.41100000", 
            "closeTime" : 1511150399999.0, 
            "quoteVolume" : "26005.98290000", 
            "trades" : 35,
            "baseAssetVolume" : "432.53200000", 
            "quoteAssetVolume" : "18427.26490000"
        })

        t.equal(advice.action, 'rebalance')
    })
})
