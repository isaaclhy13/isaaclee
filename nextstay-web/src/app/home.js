"use client"; // This is a client component

import { PRIMARYCOLOR } from "../../sharedUtils"
import TextField from '@mui/material/TextField';
import { Button, Grid, InputAdornment,  } from "@mui/material";

//Components
import Footer from '../app/components/footer.js'

//Image 
import Image from 'next/image'
import HouseSVG from '../../public/landingHouse.svg'

import Mission1 from '../../public/LandingFourPros/rocket.svg'
import Mission2 from '../../public/LandingFourPros/scale.svg'
import Mission3 from '../../public/LandingFourPros/price.svg'
import Mission4 from '../../public/LandingFourPros/safety.svg'

import LandingWave from '../../public/landingWave.svg'
import { useEffect, useState } from "react";

//Constants 
const MISSIONPROS = [
    {svg: Mission1, name: "Faster", details: "Our platform is designed for speed, ensuring you secure your ideal sublet in no time.", color: 'red'},
    {svg: Mission2, name: "Easier", details: "We simplify the search, so you can quickly discover your perfect sublet with ease.", color: 'green'},
    {svg: Mission3, name: "Cheaper", details: "Affordable sublets without compromising quality, choose cost-effective comfort.", color: 'blue'},
    {svg: Mission4, name: "Safer", details: "With robust security measures and thorough verification, experience secure subletting.", color: 'pink'}
]
export default function HomeScreen(){

    const [mobile, setMobile] = useState(false)

    //Form Inputs
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [messageEmail, setMessageEmail] = useState("")
    const [message, setMessage] = useState("")

    useEffect(()=> {
        checkIsMobile()
    }, [])

    function checkIsMobile(){
        let width = window.innerWidth
        if(width < 920){
            setMobile(true)
        }
    }

    //Subscribe to our waitlist
    async function handleEmailSubscribe(){
        if(email.trim() == ""){
            alert("Please enter a valid email.")
            return        
        }
        else{
            try{
                await fetch('https://nextstay-09a1b7efd58f.herokuapp.com/leads', {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    ip_address: "test"
                })
                })
                .then(async res => {
                    if(res.status == 200){
                        alert("You've successfully subscribed.")
                    } 
                    else{
                        alert("Something went wrong. Please try again later.")
                    }
                })
            }
            catch(e){
                console.log(e)
            }
        }
    }

    //Send us a message with name, email and message
    async function handleSendMessage(){
        if(name.trim() == "" || messageEmail.trim() == "" || message.trim() == ""){
            if(name.trim() == ""){
                alert("Please enter your name.")
            }
            else if(messageEmail.trim() == ""){
                alert("Please enter your email.")
            }
            else if(message.trim() == ""){
                alert("Please enter a message.")
            }
            return;
        }
        else{
            await fetch('https://nextstay-09a1b7efd58f.herokuapp.com/contact', {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    ip_address: "test",
                    name: name,
                    message: message,
                })
            })
            .then(async res => {
                if(res.status == 200){
                    alert("Your messages have successfully sent.")
                } 
                else{
                    alert("Something went wrong. Please try again later.")
                }
            })
        }
    }

    return(
        <div style={{width:'100vw', height:'auto', backgroundColor:'white'}}>
            <div style={{flexDirection: mobile ? 'column-reverse' : 'row', display:'flex', paddingTop: mobile ? '3vh' : '10vh', paddingBottom:'10vh', paddingLeft: mobile ? '5vw' : '10vw', paddingRight:mobile ? '5vw' : '10vw'}}>
                <div style={{flex: 1,  width: mobile ? '100%' : '50%', textAlign: mobile ? 'center' : 'flex-start'}}>
                    <div style={{marginTop: mobile ? '3vh' : 0}}>
                        <p style={{fontSize: mobile ? '1.8rem' : '2.8rem', color:'black', fontWeight: mobile ? '600' : '500'}}>Subletting Re-imagined,</p>
                        <p style={{fontSize: mobile ? '1.8rem' : '2.8rem', color:'black', fontWeight: mobile ? '600' : '500'}}>find your <span style={{color:PRIMARYCOLOR}}>nextstay</span>.</p>
                    </div>
                    <div style={{marginTop: mobile ? '3vh' : '6vh'}}>
                        <p style={{fontSize: mobile ? '1rem' : '1.2rem', color:'black', width: mobile ? '100%' : '90%',}}>2024 Summer Season is coming soon! Subscribe to get notified when we are live notified when we are live.</p>
                    </div>
                    <div style={{marginTop:'6vh', width: mobile ? '100%' : '90%'}}>
                        <TextField 
                        style={{borderColor: PRIMARYCOLOR}}
                        value={email}
                        onChange={(val)=> setEmail(val.target.value)}
                        variant="outlined" label="Email" fullWidth
                        InputProps={{
                            endAdornment: (
                                <Button onClick={handleEmailSubscribe} variant="contained" sx={{textTransform:'none'}}>
                                    Subscribe
                                </Button>
                            ),
                          }}
                        />
                        <p style={{fontSize:'0.8rem', color:'black', width: mobile ? '100%' : '90%', fontWeight:'300', color:'#828282', marginTop:'1vh'}}>By submitting this form, you agree to receive recurring promotional and personalized marketing emails from nextstay LLC at the email used to subscribe. View Terms & Privacy.</p>
                    </div>
                </div>
                <div style={{flex: 1, width: mobile ? '100%' : '50%', display:'flex', flexDirection:'row', justifyContent: mobile ? 'center' : 'flex-end', alignItems:'center'}}>
                    <Image src={HouseSVG} width={mobile ? 220 : 380} height={mobile ? 'auto' : 380}/>
                </div>
            </div>
            
            <div style={{width:'100%', backgroundColor: PRIMARYCOLOR, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:'5vh', paddingBottom:'5vh', textAlign:'center'}}>
                <p style={{fontSize:'1.2rem', color:'white',}}>Join the waitlist along with over <span style={{fontWeight:'600'}}>2,000</span> students who have already subscribed</p>
            </div>

            <div style={{paddingTop: mobile ? '10vh' : '15vh', paddingBottom:'5vh', justifyContent:'center', alignItems:'center', textAlign:'center', display:'flex', flexDirection:'column'}}>
                <div style={{width: mobile ? '90%' : '100%'}}>
                    <p style={{fontSize:'1.2rem', color:'black',}}>our mission</p>
                    <p style={{fontSize: mobile ? '2rem' : '2.8rem', color:'black', fontWeight:'500', marginTop:'3vh'}}>“Subletting should be dead <span style={{color: PRIMARYCOLOR}}>simple</span>.”</p>
                    <p style={{fontSize:mobile ? '1rem' : '1.2rem', color:'black', fontWeight:'300', marginTop:'1vh'}}>From founders of NextStay</p>
                </div>
                <div style={{paddingTop: mobile ? '5vh' : '15vh', paddingBottom: mobile ? 0 : '15vh', width:'80vw'}}>
                    <Grid container  rowSpacing={mobile ? 5 : 0} columnSpacing={{ xs: 1, sm: 2, md: 3, lg:0 }}>
                        {MISSIONPROS.map((data)=> (
                            <Grid key={"grid" + data.name} item lg={3} >
                                <div style={{padding:'2vh'}}>
                                    <div style={{flexDirection: mobile ? 'column' : 'row', display:'flex',  alignItems:'center'}}>
                                        <Image src={data.svg} width={mobile ? 90 : 60} height={ mobile ? 90 : 60} />
                                        <p style={{fontSize:'1.4rem', color:'black', fontWeight:'600', marginLeft:'2vw', marginTop: mobile ? '2vh' : 0}}>{data.name}</p>
                                    </div>
                                    <div style={{marginTop:'2vh', }}>
                                        <p style={{color:'black', textAlign: mobile ? 'center' : 'left'}}>{data.details}</p>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
            <div style={{position:'relative'}}>
                <Image src={LandingWave} width={'100vw'} height={'auto'} />
                <div style={{position:'absolute', top: mobile ? '25vh' : '30vh', left: 0, width:'100vw', height:'auto', paddingTop:'5vh', paddingBottom:'5vh', paddingLeft: mobile ? '5vw' : '10vw', paddingRight: mobile ? '5vw' : '10vw', flexDirection: mobile ? 'column' : 'row', display:'flex', textAlign: mobile ? 'center' : 'left'}}>
                    <div style={{width: mobile ? '100%' : '50%', justifyContent:'center', display:'flex', flexDirection:'column'}}>
                        <p style={{fontSize:'2.8rem', color:'white', fontWeight:'500'}}>Subletting?</p>
                        <div style={{marginTop:'2vh'}}>
                            <p style={{fontSize: mobile ? '1rem' : '1.2rem', color:'white', width: mobile ? '100%' : '90%' }}>Looking to sublease your apartment? Send us a message and we will get back to you! Start saving more simply by planning earlier.</p>
                        </div>
                    </div>
                    <div style={{marginTop:mobile ? '3vh' : 0, width: mobile ? '100%' : '50%', alignItems: mobile ? 'center' : 'flex-end', display:'flex', flexDirection:'column'}}>
                        <div style={{width: mobile ? '100%' : '80%'}}>
                            <TextField variant="standard" 
                            value={name}
                            onChange={(val)=> setName(val.target.value)}
                            fullWidth
                            placeholder="Name"
                            style={{backgroundColor:'white', paddingLeft:'1vw', paddingTop:'1vh', paddingBottom:'1vh', borderRadius: 5}}
                            InputProps={{ disableUnderline: true }}/>
                        </div>
                        <div style={{width: mobile ? '100%' : '80%', marginTop:'1vh'}}>
                            <TextField variant="standard" 
                            value={messageEmail}
                            onChange={(val)=> setMessageEmail(val.target.value)}
                            fullWidth
                            placeholder="Email"
                            style={{backgroundColor:'white', paddingLeft:'1vw', paddingTop:'1vh', paddingBottom:'1vh', borderRadius: 5}}
                            InputProps={{ disableUnderline: true }}/>
                        </div>
                        <div style={{width: mobile ? '100%' : '80%', marginTop:'1vh'}}>
                            <TextField variant="standard" 
                            value={message}
                            onChange={(val)=> setMessage(val.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Message..."
                            style={{backgroundColor:'white', paddingLeft:'1vw', paddingTop:'1vh', paddingBottom:'1vh', borderRadius: 5}}
                            InputProps={{ disableUnderline: true }}/>
                        </div>
                        <div style={{width: mobile ? '100%' : '80%', marginTop: mobile ? '4vh' : '1vh'}}>
                            <Button onClick={handleSendMessage} variant="contained" fullWidth={ mobile ? true: false }  style={{textTransform:'none', backgroundColor:'white', color:'black', paddingLeft:'3vw', paddingRight:'3vw'}}>
                                <p>Submit</p>
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{position:'absolute', bottom:0, width:'100vw', height:'7vh', left:0, backgroundColor:'white', display:'flex', alignItems:'center'}}>
                    {Footer()}
                </div>
            </div>
        </div>
    )
}