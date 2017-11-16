import Assessment from '../src/assessment'
import uniq from 'lodash/uniq'
import isEqual from 'lodash/isEqual'

// Feel free to rewrite this test suite. This is provided as guidance.
describe('The Assessment', () => {
  it('should have 30 questions', () => {
    const AssessmentTest = new Assessment()
    AssessmentTest.run(15)
    expect((uniq(AssessmentTest.answered)).length).toBe(30)
  })
  it('should not show the same answer twice', () => {
    const AssessmentTest = new Assessment()
    AssessmentTest.run()
    const uniqueList = uniq(AssessmentTest.answered)
    expect(isEqual(uniqueList, AssessmentTest.answered)).toBeTruthy()
  })
  it('should match each dimension to the other dimensions exactly 2 times', () => {
    const AssessmentTest = new Assessment()
    AssessmentTest.run(6)
    for (let category in AssessmentTest.categoriesCalled) {
      expect(AssessmentTest.categoriesCalled[category]).toBe(2)
    }
  })
  it('should provide ipsative questions (two possible answers)', () => {
    const AssessmentTest = new Assessment()
    expect(AssessmentTest.showAnswers().length).toBe(2)
  })
  describe('when completed', () => {
    const AssessmentTest = new Assessment()
    AssessmentTest.run()
    it('should provide the results as an object', () => {
      expect(Object.prototype.toString.call(AssessmentTest.userResponse)).toBe('[object Object]')
    })
    it('should represent the results based on 6 dimensions', () => {
      expect(Object.keys(AssessmentTest.userResponse).length).toBe(6)
    })
  })
})
