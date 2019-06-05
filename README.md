# Prisma Kube
> TODO

## Development Setup
Set up kubernetes, minikube, etc.  Start minikube.

Setup secret for access to private docker images.  Replace with path to
docker config.json.  Make sure to appropriately setup authorization according
to registry being used (i.e. gcr via gcloud).

Gcloud:
```sh
# create a GCP service account; format of account is email address
SA_EMAIL=$(gcloud iam service-accounts --format='value(email)' create k8s-gcr-auth-ro)
# create the json key file and associate it with the service account
gcloud iam service-accounts keys create k8s-gcr-auth-ro.json --iam-account=$SA_EMAIL
# get the project id
PROJECT=$(gcloud config list core/project --format='value(core.project)')
# add the IAM policy binding for the defined project and service account
gcloud projects add-iam-policy-binding $PROJECT --member serviceAccount:$SA_EMAIL --role roles/storage.objectViewer
```

if `.docker` is in home directory:
```sh
SECRETNAME=regcred

kubectl create secret docker-registry $SECRETNAME \
  --namespace prisma \
  --docker-server=https://gcr.io \
  --docker-username=_json_key \
  --docker-email=mcabrams1@gmail.com.com \
  --docker-password="$(cat k8s-gcr-auth-ro.json)"
```

Add the secret to the Kubernetes configuration.
You can add it to the default service account with the following command:

```sh
SECRETNAME=regcred

kubectl patch serviceaccount default \
  -n prisma \
  -p "{\"imagePullSecrets\": [{\"name\": \"$SECRETNAME\"}]}"
```

Then deploy manifests either with kubectl or skaffold


### Option 1: skaffold

```sh
skaffold dev
```

### Options 2: kubectl

```sh
kubectl apply -f .
kubectl apply -f ./server/
kubectl apply -f ./database/
kubectl apply -f ./prisma/
```

Open server in browser
```sh
minikube service -n prisma server
```

## Installing new packages or using CLI to adjust what gets included in prisma image
```sh
cd server/
docker-compose build
docker-compose up -d
```


To perform actions inside container:
```
docker-compose run server /bin/sh
```

Open http://localhost:4666/graphql


## Running Tests
```sh
#TODO
```
## Deployment
```sh
#TODO
```
