import React from 'react';
import { View, Image } from 'react-native'

const tabbarPath = '../assets/images/tabbar/'
const mainPath = '../assets/images/main/'
const headerPath = '../assets/images/header/'
const images = {
  btnHome : [ require( tabbarPath + 'btnHome.png'), require( tabbarPath + 'btnHomeSel.png')],
  btnStore : [ require( tabbarPath + 'btnStore.png'), require( tabbarPath + 'btnStoreSel.png')],
  btnCart : [ require( tabbarPath + 'btnCart.png'), require( tabbarPath + 'btnCartSel.png')],
  btnMypage : [ require( tabbarPath + 'btnMypage.png'), require( tabbarPath + 'btnMypageSel.png')],
  btnSetup : [ require( tabbarPath + 'btnSetup.png'), require( tabbarPath + 'btnSetupSel.png')],
  btnCheck2 : [ require( mainPath + 'btnCheck2.png'), require( mainPath + 'btnCheck2Sel.png')],
  iconArrowRight : [ require( mainPath + 'iconArrowRight.png')],
  iconArrowUp : [ require( mainPath + 'iconArrowUp.png')],
  iconArrowDown : [ require( mainPath + 'iconArrowDown.png')],
  imgPeople : [ require( mainPath + 'imgPeople.png')],
  imgCard1 : [ require( mainPath + 'imgCard1.png')],
  imgCard2 : [ require( mainPath + 'imgCard2.png')],
  imgCard3 : [ require( mainPath + 'imgCard3.png')],
  imgGuid1 : [ require( mainPath + 'imgGuid1.png')],
  iconTrash : [ require( mainPath + 'iconTrash.png')],
  btnSearchOff : [ require( mainPath + 'btnSearchOff.png')],
  imgPeopleL : [ require( mainPath + 'imgPeopleL.png')],
  imgPeoplePlus : [ require( mainPath + 'imgPeoplePlus.png')],
  btnCancel: [ require( mainPath + 'btnCancel.png')],
  iconCamera: [ require( mainPath + 'iconCamera.png')],
  btnReply: [ require( mainPath + 'btnReply.png')],
  btnAlarm: [ require( headerPath + 'btnAlarm.png')],
  btnCnter: [ require( headerPath + 'btnCnter.png')],
  btnCheck : [ require( mainPath + 'btnCheckNon.png'), require( mainPath + 'btnCheckSel.png')],
}

export default function AppIcon({name, focused, style, checked}) {
  const source = images[name]
  if (source) return ( 
    <View style={[style, {alignSelf:'center'}]}>
      <Image source={(focused || checked) && source.length > 1 ? source[1] : source[0]}/>
    </View>
  )
  return null
}
