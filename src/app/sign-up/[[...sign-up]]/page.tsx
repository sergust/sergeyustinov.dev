import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="glass-enhanced relative overflow-hidden rounded-lg border border-white/10 p-8 shadow-md backdrop-blur-md dark:border-white/5">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">Join Us</h1>
            <p className="text-white/70">Create your account to get started</p>
          </div>

          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg transition-all duration-200',
                card: 'bg-transparent shadow-none border-none',
                headerTitle: 'text-white text-2xl font-bold',
                headerSubtitle: 'text-white/70',
                socialButtonsBlockButton:
                  'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200',
                socialButtonsBlockButtonText: 'text-white font-medium',
                formFieldInput:
                  'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20',
                formFieldLabel: 'text-white font-medium',
                footerActionLink:
                  'text-blue-400 hover:text-blue-300 transition-colors',
                dividerLine: 'bg-white/20',
                dividerText: 'text-white/70',
                formFieldSuccessText: 'text-green-400',
                formFieldErrorText: 'text-red-400',
                identityPreviewText: 'text-white/70',
                identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
                formFieldInputShowPasswordButton:
                  'text-white/70 hover:text-white',
                formFieldAction: 'text-blue-400 hover:text-blue-300',
              },
              variables: {
                colorPrimary: '#3b82f6',
                colorBackground: 'transparent',
                colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                colorInputText: '#ffffff',
                colorTextOnPrimaryBackground: '#ffffff',
                colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
                colorSuccess: '#10b981',
                colorDanger: '#ef4444',
                colorWarning: '#f59e0b',
                borderRadius: '0.5rem',
              },
            }}
            routing="path"
            path="/sign-up"
            redirectUrl="/"
            afterSignUpUrl="/"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
