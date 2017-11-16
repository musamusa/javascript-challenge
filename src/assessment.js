import dimensions from './dimensions'
import cloneDeep from 'lodash/cloneDeep'

class Assessment {
  constructor () {
    this.currentCollection = 'collection'
    this.collection = cloneDeep(dimensions)
    this.usedCollection = []
    this.userResponse = {}
    this.categoriesCalled = {}
    this.currentQuestionStack = []
    this.currentCategoryStack = []
    this.answered = []
  }

  getRandomIndexFromList (list) {
    return Math.floor(Math.random() * list.length)
  }

  updateCurrent (current) {
    if (current === 'collection') {
      this.currentCollection = 'usedCollection'
    }

    if (current === 'usedCollection') {
      this.currentCollection = 'collection'
    }
  }

  getTarget (src) {
    if (src === 'collection') {
      return 'usedCollection'
    }

    if (src === 'usedCollection') {
      return 'collection'
    }
  }

  selectCollection () {
    const selectedCollectionInfo = {
      src: this.currentCollection
    }
    if (this[this.currentCollection].length === 0) {
      this.updateCurrent(this.currentCollection)
      selectedCollectionInfo.src = this.currentCollection
    }
    selectedCollectionInfo.target = this.getTarget(selectedCollectionInfo.src)
    return selectedCollectionInfo
  }

  getRandomQuestion (answers) {
    const index = this.getRandomIndexFromList(answers)
    return answers[index]
  }

  getCategory () {
    const collectionOption = this.selectCollection()
    const categoryIndex = 0
    const categoryData = this[collectionOption.src][categoryIndex]
    this[collectionOption.src].splice(categoryIndex, 1)
    return {
      data: categoryData,
      src: collectionOption.src,
      target: collectionOption.target
    }
  }

  showAnswers () {
    const firstCategory = this.getCategory()
    const secondCategory = this.getCategory()

    const firstQuestion = this.getRandomQuestion(firstCategory.data.answers)
    const secondQuestion = this.getRandomQuestion(secondCategory.data.answers)

    const firstQIndex = firstCategory.data.answers.indexOf(firstQuestion)
    const secondQIndex = secondCategory.data.answers.indexOf(secondQuestion)

    firstCategory.data.answers.splice(firstQIndex, 1)
    secondCategory.data.answers.splice(secondQIndex, 1)

    this[firstCategory.target].push(firstCategory.data)
    this[secondCategory.target].push(secondCategory.data)

    this.categoriesCalled[firstCategory.data.name] = typeof this.categoriesCalled[firstCategory.data.name] === 'undefined'
      ? 0 : this.categoriesCalled[firstCategory.data.name]
    this.categoriesCalled[firstCategory.data.name]++

    this.categoriesCalled[secondCategory.data.name] = typeof this.categoriesCalled[secondCategory.data.name] === 'undefined'
      ? 0 : this.categoriesCalled[secondCategory.data.name]
    this.categoriesCalled[secondCategory.data.name]++

    this.currentQuestionStack = [firstQuestion, secondQuestion]
    this.currentCategoryStack = [firstCategory.data.name, secondCategory.data.name]
    this.answered.push(firstQuestion)
    this.answered.push(secondQuestion)
    return this.currentQuestionStack
  }

  getUserResponse (index) {
    const category = this.currentCategoryStack[index - 1]
    if ([1, 2].indexOf(index) < 0) {
      return 'please select 1 or 2'
    }
    this.userResponse[category] = typeof this.userResponse[category] === 'undefined' ? 0 : this.userResponse[category]
    this.userResponse[category]++
    this.currentCategoryStack = []
    this.currentQuestionStack = []
    return 'next question'
  }

  run (numberOfTimes = 30) {
    for (let i = 0; i < numberOfTimes; i++) {
      const response = this.getRandomIndexFromList([0, 1]) + 1
      this.showAnswers()
      this.getUserResponse(response)
    }
  }
}

export default Assessment
