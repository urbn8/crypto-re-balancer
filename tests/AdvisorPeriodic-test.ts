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
            "timestamp" : 1511146800000.0,
        })

        t.equal(advice.action, 'rebalance')
    })
})
