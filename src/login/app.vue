<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <el-container class="body-container">
    <el-card class="box-card">
      <div slot="header" class="header">
        <h4>Connexion</h4>
      </div>
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm"
        label-width="24px"
      >
        <el-form-item prop="login">
          <template slot="label">
            <i class="el-icon-user"></i>
          </template>
          <el-input v-model="ruleForm.login"></el-input>
        </el-form-item>

        <el-form-item prop="pass">
          <template slot="label">
            <i class="el-icon-lock"></i>
          </template>
          <el-input
            v-model="ruleForm.pass"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            Submit
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
import { login } from './login';
export default {
  name: 'App',
  data() {
    return {
      ruleForm: {
        login: '',
        pass: '',
      },
      rules: {
        login: [{ min: 1, message: 'Please input an login', trigger: 'blur' }],
        pass: [
          { min: 1, message: 'Please input an password', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await login(this.ruleForm.login, this.ruleForm.pass);
          } catch (e) {
            this.$notify.error({
              title: 'Error',
              message: e,
            });
          }
          // Identifiant ou mot de passe incorrect
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style>
.body-container {
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.body-container::before {
  background: rgba(0, 0, 0, 0.5);
}

.header {
  text-align: center;
}
.header h4 {
  margin: auto;
}
</style>
