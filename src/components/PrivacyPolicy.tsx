import { TypographyH1,TypographyH2,TypographyP } from "./ui/typography"

const PrivacyPolicy = () => {
  return (
    <div className="py-8 max-w-screen-lg mx-auto container">
        <TypographyH1 className="text-center my-12 ">Privacy Policy</TypographyH1>
        <TypographyP>
        At TimeTracker, we prioritize the privacy of our users. Our application, 
        available at https://time-tracker.veiag.xyz, is designed to ensure the security of your information. Below is an outline of the data we collect and how we utilize it.
        </TypographyP>
    <TypographyH2>Data Storage</TypographyH2>
    <TypographyP>TimeTracker stores all information locally, utilizing the IndexedDB feature of your browser. This ensures that your data remains on your device and is not transmitted to external servers unless explicitly authorized by you.</TypographyP>
    <TypographyH2> Google Account Integration</TypographyH2>
    <TypographyP>
        TimeTracker offers the option to log in with your Google account, enabling the storage of data on Google Drive. 
        When you log in with your Google account, we collect certain user information, including email, profile photo, and name. 
        Additionally, we request access to the AppData folder on Google Drive to store application data. 
        This information is used solely for authentication purposes and is not shared with third parties.
    </TypographyP>

    <TypographyH2>Log Files</TypographyH2>
    <TypographyP>
        TimeTracker follows standard logging procedures for website visits. This includes collecting IP addresses, browser types, timestamps, referring/exit pages, and click data. This information is used for analytical purposes, such as tracking trends and improving user experience, and is not personally identifiable.
    </TypographyP>
    <TypographyH2>Third-party Services</TypographyH2>
    <TypographyP>
        Please note that TimeTracker may contain links or advertisements from third-party services. These services may utilize cookies or similar technologies to track user activity and personalize advertisements. However, TimeTracker does not have control over the cookies used by these third parties.
    </TypographyP>
    <TypographyH2>Children's Privacy</TypographyH2>
    <TypographyP>
    TimeTracker does not knowingly collect personal information from children under the age of 13. If you believe your child has provided personal information on our website, please contact us immediately, and we will take appropriate action.
    </TypographyP>
    <TypographyH2>Online Privacy Policy Only</TypographyH2>
    <TypographyP>
        This Privacy Policy applies solely to information collected through TimeTracker's website and application. It does not extend to any offline activities or external websites linked to TimeTracker.
    </TypographyP>
    <TypographyH2>Consent</TypographyH2>
    <TypographyP>
    By using TimeTracker, you consent to the terms outlined in this Privacy Policy and agree to our Terms and Conditions.
    </TypographyP>

    <TypographyP>
    For further inquiries or assistance regarding our Privacy Policy, please don't hesitate to contact us.
    </TypographyP>

    </div>
  )
}

export default PrivacyPolicy