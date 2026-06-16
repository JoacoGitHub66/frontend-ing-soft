import {expect, jest, test} from '@jest/globals'
import {subject} from '@/observer/subjetc'


describe('subject', () => {
    test('deberia notificar a varios observers cuando cambia la temperatura', () => {
        const subjectMultiple= new subject()

        const observerMock1 = {
            update: jest.fn()
        }

        const observerMock2 = {
            update: jest.fn()
        }

        subjectMultiple.subscribe(observerMock1)
        subjectMultiple.subscribe(observerMock2)

        subjectMultiple.notify(80)

        expect(observerMock1.update).toHaveBeenCalledWith(80)
        expect(observerMock1.update).toHaveBeenCalledTimes(1)

        expect(observerMock2.update).toHaveBeenCalledWith(80)
        expect(observerMock2.update).toHaveBeenCalledTimes(1)
    })
})