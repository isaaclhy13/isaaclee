//Constants 
const FOOTERLINKS = ["© 2023 nextstay, LLC.", "Terms", "Privacy", "Contact Us"]

//Icons
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { INSTAGRAMLINK } from '../../../sharedUtils';
import { LINKEDINLINK } from '../../../sharedUtils';

function handleSocialMediaClick(platform){
    if(platoform == ""){
        
    }
}

export default function FooterScreen(){
    return(
        <div style={{height:'100%', width:'100vw',  paddingLeft:'5vw', paddingRight:'5vw', justifyContent:'space-between', display:'flex', alignItems:'center'}}>
            <div style={{flexDirection:'row', display:'flex'}}>
                {FOOTERLINKS.map(links => {
                    return (
                        <p key={links} style={{color:'black', marginRight:'3vw', cursor: 'pointer', fontSize:'0.8rem'}}>{links}</p>
                    )
                })}
            </div>
            <div style={{flexDirection:'row', display:'flex', }}>
                <InstagramIcon onClick={() => handleSocialMediaClick("instagram")} style={{color:'black', fontSize:'2rem'}}/>
                <FacebookIcon onClick={() => handleSocialMediaClick("facebook")} style={{color:'black', fontSize:'2rem', marginLeft:'2vw'}}/>
                <LinkedInIcon onClick={() => handleSocialMediaClick("linkedin")} style={{color:'black', fontSize:'2rem', marginLeft:'2vw'}}/>
            </div>
        </div>
    )
}