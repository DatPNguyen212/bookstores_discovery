// import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
// import mongoose from 'mongoose'

// const ModelClassMock = {
//   deleteMany: vi.fn(),
// }

// vi.mock('mongoose', () => {
//   return {
//     default: {
//       connection: {
//         models: {
//           ModelClassMock,
//         },
//       },
//     },
//   }
// })

// describe('dbUtils.clearCollection', () => {})

// describe('dbUtils.getModelClass()', () => {
//   it('when you pass the model name, it should return the correct ModelClass from mongoose.connection.models', () => {
//     const modelName = 'ModelClassMock'

//     const res = testDBUtils.getModelClass(modelName)

//     expect(res).toEqual(ModelClassMock)
//   })
// })
