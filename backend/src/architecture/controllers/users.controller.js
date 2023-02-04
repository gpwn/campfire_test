const UsersService = require("../services/users.service");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Cache = require("memory-cache");
const { createRandomNumber } = require("../../util/auth-encryption.util");
const axios = require("axios");

class UsersController {
  usersService = new UsersService();

  //회원가입 API
  signUp = async (req, res) => {
    try {
      const { email, userName, password, phoneNumber } = req.body;

      let profileImg = undefined;
      if (req.file) {
        profileImg = req.file.location;
      } else {
        profileImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      }

      await this.usersService.signUp(
        email,
        userName,
        password,
        phoneNumber,
        profileImg
      );

      res.status(201).json({ message: "회원가입에 성공하였습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        errorMessage: "회원가입에 실패하였습니다.",
      });
    }
  };

  //아이디/닉네임 통합 중복확인 API
  findDup = async (req, res) => {
    const query = req.query;
    try {
      const message = await this.usersService.findDup(query);
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      if (error === "이미 사용중인 이메일입니다.") {
        return res.status(412).json({
          errorMessage: "이미 사용중인 이메일입니다.",
        });
      }
      if (error === "이미 사용중인 닉네임입니다.") {
        return res.status(412).json({
          errorMessage: "이미 사용중인 닉네임입니다.",
        });
      }
      res.status(400).json({
        errorMessage: "중복확인에 실패하였습니다.",
      });
    }
  };

  logIn = async (req, res) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await this.usersService.logIn(
        email,
        password
      );
      const { userId } = jwt.verify(
        accessToken,
        process.env.TOKEN_USER_SECRET_KEY
      );
      console.log(`accessToken = ${accessToken}`);

      res.header({
        accesstoken: `Bearer ${accessToken}`,
        refreshtoken: `Bearer ${refreshToken}`,
      });
      res.status(200).json({
        userId: userId,
      });
    } catch (error) {
      console.log(error);
      if (error === "아이디 또는 패스워드가 일치하지 않습니다.") {
        return res.status(412).json({
          errorMessage: "아이디 또는 패스워드가 일치하지 않습니다.",
        });
      }
      res.status(400).json({
        errorMessage: "로그인에 실패하였습니다.",
      });
    }
  };

  findOneUser = async (req, res) => {
    try {
      const userId = res.locals.userId;
      const user = await this.usersService.findOneUser(userId);
      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      if (error === "존재하지 않는 사용자입니다.") {
        return res.status(404).json({
          errorMessage: "존재하지 않는 사용자입니다.",
        });
      }
      res.status(400).json({
        errorMessage: "사용자 정보 불러오기에 실패하였습니다.",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const userId = res.locals.userId;
      let { userName } = req.body;

      let profileImg = undefined;
      if (req.file) {
        profileImg = req.file.location;
      } else {
        profileImg = req.body.profileImg;
      }

      await this.usersService.updateUser(userId, userName, profileImg);
      return res.status(201).json({ message: "사용자 정보가 수정되었습니다." });
    } catch (error) {
      console.log(error);
      if (error.message === "존재하지않는 사용자입니다.") {
        return res
          .status(404)
          .json({ errorMessage: "존재하지않는 사용자입니다." });
      }
      if (error.message === "수정사항이 없습니다.") {
        return res.status(401).json({ errorMessage: "수정사항이 없습니다." });
      }
      res.status(400).json({
        errorMessage: "사용자 정보 수정에 실패하였습니다.",
      });
    }
  };

  deleteUser = async (req, res) => {
    const userId = res.locals.userId;
    try {
      const provider = await this.usersService.deleteUser(userId);
      return res.status(200).json({
        userId,
        provider,
        message: "회원탈퇴에 성공하였습니다.",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        errorMessage: "회원탈퇴에 실패하였습니다",
      });
    }
  };

  //문자인증
  sendMessage = async (req, res) => {
    const { phoneNumber } = req.params;

    const tel = phoneNumber.split("-").join("");
    try {
      const isExistPhoneNumber = await this.usersService.isExistPhoneNumber(
        phoneNumber
      );

      if (!isExistPhoneNumber) {
        throw new Error("해당하는 이메일 혹은 비밀번호가 없습니다.");
      }

      const verificationCode = createRandomNumber();
      const date = Date.now().toString();

      Cache.del(tel);
      Cache.put(tel, verificationCode);

      const method = "POST";
      const space = " ";
      const newLine = "\n";
      const url = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.SMS_API_KEY}/messages`;
      const url2 = `/sms/v2/services/${process.env.SMS_API_KEY}/messages`;

      const hmac = CryptoJS.algo.HMAC.create(
        CryptoJS.algo.SHA256,
        process.env.SMS_SECRET_KEY
      );
      hmac.update(method);
      hmac.update(space);
      hmac.update(url2);
      hmac.update(newLine);
      hmac.update(date);
      hmac.update(newLine);
      hmac.update(process.env.SMS_ACCESS_KEY);
      const hash = hmac.finalize();
      const signature = hash.toString(CryptoJS.enc.Base64);

      const smsRes = await axios({
        method: method,
        url: url,
        headers: {
          "Contenc-type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": process.env.SMS_ACCESS_KEY,
          "x-ncp-apigw-timestamp": date,
          "x-ncp-apigw-signature-v2": signature,
        },
        data: {
          type: "SMS",
          countryCode: "82",
          from: "01066307548",
          content: `인증번호는 [${verificationCode}] 입니다.`,
          messages: [{ to: `${tel}` }],
        },
      });

      console.log("문자보내짐?!!", smsRes.data);
      res.status(200).json({ message: "인증번호 발송 완료!" });
    } catch (error) {
      Cache.del(tel);
      console.log(error);
      if (error.message === "해당하는 이메일 혹은 비밀번호가 없습니다.") {
        return res.status(412).json({
          errorMessage: "해당하는 이메일 혹은 비밀번호가 없습니다.",
        });
      }
      res.status(400).json({ errorMessage: "인증번호 발송 실패" });
    }
  };
  verifyCode = async (req, res) => {
    const { phoneNumber, verifyCode } = req.body;
    console.log("verifyCode =======", phoneNumber, verifyCode);
    const tel = phoneNumber.split("-").join("");

    const CacheData = Cache.get(tel);
    console.log(CacheData);
    if (!CacheData) {
      return res
        .status(400)
        .json({ errorMessage: "인증번호를 다시 요청해주세요." });
    }

    if (CacheData !== verifyCode) {
      return res
        .status(400)
        .json({ errorMessage: "인증번호를 다시 요청해주세요." });
    }

    Cache.del(phoneNumber);
    return res.status(201).json({ message: "인증성공!" });
  };

  // 유저 이메일 찾기
  findUserEmail = async (req, res, next) => {
    try {
      const { phoneNumber } = req.query;

      const email = await this.usersService.findUserEmail(phoneNumber);
      res.status(200).json({
        email,
        message: "이메일 찾기에 성공하였습니다.",
      });
    } catch (error) {
      if (error.message === "존재하지않는 사용자입니다.") {
        return res
          .status(404)
          .json({ errorMessage: "존재하지않는 사용자입니다." });
      }
      if (error.message === "sns는 이메일을 찾을 수 없습니다.") {
        return res
          .status(412)
          .json({ errorMessage: "sns는 이메일을 찾을 수 없습니다." });
      }
      next(error);
    }
  };
  // 유저 비밀번호 변경하기
  updateUserPW = async (req, res, next) => {
    try {
      const { email, phoneNumber, password } = req.body;

      await this.usersService.updateUserPW(email, phoneNumber, password);
      res.status(201).json({
        email,
        message: "비밀번호 변경에 성공하였습니다.",
      });
    } catch (error) {
      if (error.message === "존재하지않는 사용자입니다.") {
        return res
          .status(404)
          .json({ errorMessage: "존재하지않는 사용자입니다." });
      }
      if (error.message === "sns는 비밀번호를 변경 할 수 없습니다.") {
        return res.status(412).json({
          errorMessage: "sns는 비밀번호를 변경 할 수 없습니다.",
        });
      }
      if (error.message === "이메일과 전화번호를 확인하세요.") {
        return res
          .status(412)
          .json({ errorMessage: "이메일과 전화번호를 확인하세요." });
      }
      next(error);
    }
  };
}

module.exports = UsersController;
