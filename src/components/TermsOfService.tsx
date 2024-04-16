import { TypographyH1,TypographyH2,TypographyP } from "./ui/typography"

const TermsOfService = () => {
  return (
    <div className="py-8 max-w-screen-lg mx-auto container">
        <TypographyH1 className="text-center my-12">Terms of Service for TimeTracker</TypographyH1>
        <TypographyP>
        Welcome to TimeTracker! By accessing and using our website and application, you agree to comply with these Terms of Service.
        </TypographyP>
        <TypographyH2>License</TypographyH2>
        <TypographyP>
        TimeTracker is an open-source application, and all intellectual property rights for the material on TimeTracker belong to TimeTracker and/or its licensors. The application is provided under an open-source license, and you are granted the right to access and use TimeTracker for your personal and/or commercial use, subject to the terms and conditions set forth in the license agreement.
        </TypographyP>
        <TypographyH2>
        Data Storage
        </TypographyH2>
        <TypographyP>
        TimeTracker stores all user information locally using IndexedDB in the user's browser. Additionally, users have the option to log in with their Google account to enable data storage in the Google Drive AppData folder. By using TimeTracker, you consent to the storage of your data in these locations.
        </TypographyP>
        <TypographyH2>
        Privacy
        </TypographyH2>
        <TypographyP>
        Your privacy is important to us. We do not collect any personal information unless explicitly provided by you, such as when logging in with your Google account. Please refer to our Privacy Policy for more information on how we collect, use, and protect your data.
        </TypographyP>
        <TypographyH2>
        Contributions
        </TypographyH2>
        <TypographyP>
        imeTracker is an open-source project, and we welcome contributions from the community. By contributing to TimeTracker, you grant us the right to use, reproduce, and distribute your contributions under the terms of the open-source license.
        </TypographyP>
        <TypographyH2>
        Disclaimer
        </TypographyH2>
        <TypographyP>
        TimeTracker is provided "as is" without any warranty of any kind, express or implied. We do not guarantee the accuracy, reliability, or suitability of the application for any purpose. You use TimeTracker at your own risk.
        </TypographyP>
        <TypographyH2>
        Limitation of Liability
        </TypographyH2>
        <TypographyP>
        In no event shall TimeTracker or its contributors be liable for any damages arising out of the use or inability to use TimeTracker, including but not limited to, loss of data or profits, or any other incidental, consequential, or punitive damages.
        </TypographyP>
        <TypographyH2>
        Modifications
        </TypographyH2>
        <TypographyP>
        We reserve the right to modify these Terms of Service at any time. Any changes will be effective immediately upon posting on this page. Your continued use of TimeTracker after any such modifications constitutes acceptance of the revised terms.
        </TypographyP>
        <TypographyP>
        By using TimeTracker, you agree to abide by these Terms of Service. If you do not agree with any of these terms, please refrain from using TimeTracker. If you have any questions or concerns about these Terms of Service, please contact us.
        </TypographyP>
    </div>
  )
}

export default TermsOfService