import {expect, jest, test} from '@jest/globals'
import {subject} from '@/observer/subjetc'

describe('subject', () => {

  test("deberia notificar a un observer cuando cambia la temperatura",() => {
    const subjectTest= new subject()

    const observerMock = {
      update: jest.fn(),
    }

    subjectTest.subscribe(observerMock)

    subjectTest.notify(75);

    expect(observerMock.update).toHaveBeenCalledWith(75)
    expect(observerMock.update).toHaveBeenCalledTimes(1)
    expect(observerMock.update).toHaveBeenCalledWith(75)

  })

})