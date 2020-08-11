# basic-chat-app-k8s
Basic chat application (socketio). Dockerfile and kubernetes yaml files.

### About Kubernetes
You can find basic `Load Balancer` service and deployment [here](https://github.com/berkyvz/basic-chat-app-k8s/blob/master/platform/azure/deployment.yaml)

### About Application
This application developed only for understanding deploy mechanisms of Kubernetes. The codes in the project should not be considered as a proper way to write code.

### About Homework

Push your container to Azure Container Registry or dockerhub and deploy it to AKS or use Minikube & Docker for Desktop. You should use `Load Balancer` service type for the application that needs to be accesed by users (For example your frontend application) because it will gives you a static IP (You can use `NodePort` for local solutions like Minikube or Docker for Desktop). You will see the static IP of the application in the `EXTERNAL IP` tab as a result of `kubectl get services` command. You should use `ClusterIP` type for your services that shouldn't accessed by user directly (For example you backend application). You can also deploy single application, it doesnt have to follow microservices architecture. After creating AKS from [Azure Platform](https://portal.azure.com/#create/hub) you should install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) to accessing it from you computer. After that you can follow the steps below. 
```sh
az login
az aks install-cli
az aks get-credentials --resource-group <your-resource-group> --name <your-aks-name> 
kubectl config use-context <context-created-by-the-commands>
kubectl get nodes
```
