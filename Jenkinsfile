pipeline {
    agent { docker { image 'node:24.17.0-alpine3.24' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
            }
        }
    }
}
