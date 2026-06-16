import {expect, jest, test} from '@jest/globals'
import {subject} from '@/observer/subjetc'

describe('subject', () => {
    test('no deberia suscribir el mismo observer dos o mas veces', () => {
        const subjectDuplicate= new subject()

        const observerMock = {
            update: jest.fn()
        }
        
        subjectDuplicate.subscribe(observerMock)
        subjectDuplicate.subscribe(observerMock)


        subjectDuplicate.notify(70)

        expect(observerMock.update).toHaveBeenCalledTimes(1)
    })
})