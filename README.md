### website: https://huggingface.co/docs/huggingface.js/main/en/index#installation

1. Installl the packages
```bash
npm install @huggingface/inference dotenv express
```


2. Create a .env file in the root directory of your project and add the following content: you can get the token from https://huggingface.co/settings/tokens
```
HF_Token=
```
3. import { HFInference } from '@huggingface/inference';

4. get HF_TOKEN from .env file by importing dotenv package
and then use dotenv.config() to get the token

5. Check to see if HF_TOKEN is set if not set, throw an error

6. intialize the inference object with
``` 
const inference = new HFInference(HF_TOKEN)
```

7. set model to the model you want to use
