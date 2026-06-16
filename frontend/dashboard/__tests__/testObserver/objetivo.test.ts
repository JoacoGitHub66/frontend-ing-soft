import {expect, jest, test} from '@jest/globals'
import {subject} from '@/observer/subjetc'

describe('subject', () => {
    test('deberia notificar a los observers cuando llega  a la temperatura objetivo', () => {
        const subjectObjective= new subject()

        const observerMock = {
            update: jest.fn()
        }

        subjectObjective.subscribe(observerMock)

        subjectObjective.notify(78)

        expect(observerMock.update).toHaveBeenCalledWith(78)
    })
})