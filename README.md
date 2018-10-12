# chr-site

## usage

1. export environment variables

    ```bash
    export IP=xx.xx.xx.xx;
    export DOMAIN=xxx.com;
    export SUBNET=xxx.xxx.xxx
    ```

2. get this

    ```bash
    git clone xxx
    cd xxx
    ```
3. run containers

    ```bash
    docker-compose up -d
    ```

## base env

[name].[domain]

|name|env|desc|supplement|
|---|:---:|---|---|
|nginx|-|提供反向代理，至各容器||
|github|node|github hook，为每次push操作同步代码|/hook，仅post|
|at|-|react based frontend||
|static|-|静态资源||

## docker network

frontend网段为[subnet].0/24

|name|ip|desc|
|---|---|---|
|nginx|.2|核心|
|github_hook|.3|代码同步|
|mysql|.4||
|php|.5|laravel|
