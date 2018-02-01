const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
    type Curso {
        id: ID!
        titulo: String!
        descripcion: String!
        profesor: Profesor
        rating: Float
        comentarios : [Comentario]
    }

    type Profesor {
        id: ID!
        nombre: String!
        nacionalidad: String!
        genero: Genero
        cursos: [Curso]
    }

    enum Genero {
        MASCULINO
        FEMENINO
    }

    type Comentario {
        id: ID!
        nombre: String!
        cuerpo: String!
    }

    type Query {
        cursos: [Curso]
        profesores: [Profesor]
        curso(id: Int): Curso
        profesor(id: Int): Profesor
    }
`

const resolvers = {
    Query: {
        cursos: () => {
            return [
                {
                    id: 1,
                    titulo: 'Curso de GraphQL',
                    descripcion: 'Aprendiendo GraphQL'
                },
                {
                    id: 2,
                    titulo: 'Curso de PHP',
                    descripcion: 'Aprendiendo PHP'
                }
            ]
        }
    },
    Curso:{
        profesor: () => {
            return {
                nombre: 'Pablo',
                nacionalidad: 'Argentina'
            }
        },
        comentarios: () => {
            return [
                {
                    nombre: 'Juan',
                    cuerpo: 'Buen video!'
                }
            ]
        }
    }
}

const schema = makeExecutableSchema({ 
    typeDefs,
    resolvers
})

module.exports = schema