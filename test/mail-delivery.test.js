const { test } = require('node:test');
const assert = require('node:assert/strict');
const { deliverMail } = require('../utils/mail-delivery');

test('does not report success until the provider completes', async () => {
    let finish;
    let complete = false;
    const provider = new Promise(resolve => { finish = resolve; });
    const delivery = deliverMail({ sendMail: () => provider }, {}).then(result => {
        complete = true;
        return result;
    });
    await Promise.resolve();
    assert.equal(complete, false);
    finish({ accepted: ['test@example.invalid'] });
    assert.equal(await delivery, true);
});

test('propagates provider failure instead of reporting delivery', async () => {
    await assert.rejects(deliverMail({ sendMail: async () => {
        throw new Error('provider rejected');
    } }, {}), /provider rejected/);
});
