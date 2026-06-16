import {expect, jest, test} from '@jest/globals'
import {subject} from '@/observer/subjetc'

describe('subject', () => {
    test('no deberia notificar a un observer que se desuscribio', () => {
        const subjectUnsubscribe= new subject()


        const observerMock = {
            update: jest.fn()
        }

        subjectUnsubscribe.subscribe(observerMock)
        subjectUnsubscribe.unsubscribe(observerMock)

        subjectUnsubscribe.notify(90)

        expect(observerMock.update).not.toHaveBeenCalled()
    })
})