import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import generadorPassword from 'password-generator';
import CryptoJS from 'crypto-js';
import { PersonaRepository } from '../repositories';
import { repository } from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})

export class UtilidadesService {
  constructor(
    @repository(PersonaRepository)
    public personaRepository : PersonaRepository
    ){}

  secretKeyAES="E7)aWV<PK$[4";

  generarPassword(){
    return generadorPassword(12,false)
  }

  encriptar(texto:string){
    let encriptado = CryptoJS.AES.encrypt(texto,this.secretKeyAES).toString();
    return encriptado;
  }

  desencriptar(texto:string){
    let desencriptado  = CryptoJS.AES.decrypt(texto, this.secretKeyAES).toString(CryptoJS.enc.Utf8);
    return desencriptado;
  }

  login(correo:string,password:string){

    try {
      
    let persona = this.personaRepository.findOne({
      where: {correo : correo, password : password}
    })

    if(persona != null){
      return persona;
    }else{
      return false;
    }

    } catch (error) {
      return false;
    }

  }

  async loginAsync(correo:string,password:string){
    try {
      
      let persona = await this.personaRepository.findOne({
        where: {correo : correo}
      })
  
      if(persona != null){

        let desencriptado = this.desencriptar(persona.password);
        if(desencriptado == password){
          return persona;
        }else{
          return false
        }

      }else{
        return false;
      }
  
      } catch (error) {
        return false;
      }
  
  }


  
}
