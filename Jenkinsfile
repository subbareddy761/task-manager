pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'subbareddy761/task-manager'      // Your Docker Hub image name
        DOCKER_CREDENTIALS_ID = 'dockerhub'             // Must match Jenkins credentials ID
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                git url: 'https://github.com/subbareddy761/task-manager.git',
                branch: 'main',
                credentialsId: 'github-creds'
                }
        }


        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}", "--no-cache .")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Image successfully pushed to Docker Hub!'
        }
        failure {
            echo '❌ Build failed. Check console logs.'
        }
    }
}
