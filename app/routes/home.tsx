import type { Route } from "./+types/home";
import { Link } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elasticware — AI-Powered Support, Live Handover" },
    {
      name: "description",
      content:
        "Watch an AI assistant handle customer questions and seamlessly hand off to a human agent, live. A demo of the future of customer support.",
    },
    { property: "og:title", content: "Elasticware — AI-Powered Support" },
    {
      property: "og:description",
      content:
        "Watch the AI-to-agent handover happen live in a split-screen sandbox. The future of customer support, today.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

const loopSteps = [
  {
    num: "01",
    title: "Customer asks",
    desc: "A shopper opens the chat widget on the storefront and types a question about returns, shipping, or their order.",
    color: "accent",
  },
  {
    num: "02",
    title: "Bot responds",
    desc: "A bot searches the knowledge base and answers instantly — no wait, no queue, any hour of the day.",
    color: "teal",
  },
  {
    num: "03",
    title: "Handover triggered",
    desc: "When the customer asks for a human or the bot isn't confident, the ticket opens in the agent queue automatically.",
    color: "accent",
  },
  {
    num: "04",
    title: "Agent takes over",
    desc: "An agent picks up the conversation, sees the full thread, and replies — the customer never leaves the chat.",
    color: "teal",
  },
];

export default function LandingPage() {
  return (
    <div className=" bg-charcoal-900 text-cream-100">
      <header className="border-b border-charcoal-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg fill="none" height="48" viewBox="0 0 221 48" width="221" xmlns="http://www.w3.org/2000/svg"><g fill="#fff"><path d="m0 6c10.1433 9.4404 25.8567 9.4404 36 0-9.4404 10.1433-9.4404 25.8567 0 36-10.1433-9.4404-25.8567-9.4404-36 0 9.44041-10.1433 9.44041-25.8567 0-36z"/><path d="m46 33v-17.862h18.304v3.536h-13.806v3.51h12.194v3.484h-12.194v3.77h14.014v3.562z"/><path d="m67.3781 33v-18.824h4.056v18.824z"/><path d="m79.7267 33.312c-.832 0-1.6034-.0693-2.314-.208-.7107-.1213-1.3347-.3293-1.872-.624-.5374-.312-.962-.728-1.274-1.248-.2947-.52-.442-1.1786-.442-1.976 0-1.092.3033-1.95.91-2.574.6066-.6413 1.456-1.1006 2.548-1.378 1.1093-.2773 2.4006-.4506 3.874-.52 1.4906-.0866 3.1113-.13 4.862-.13v-.494c0-.572-.1387-1.0226-.416-1.352-.2774-.3293-.702-.5633-1.274-.702-.5547-.156-1.2827-.234-2.184-.234-.676 0-1.3.052-1.872.156-.5547.0867-.9967.234-1.326.442-.3294.1907-.494.442-.494.754v.26h-4.082c-.0174-.0693-.0347-.13-.052-.182 0-.0693 0-.1473 0-.234 0-.8146.3033-1.5253.91-2.132.6066-.624 1.508-1.1006 2.704-1.43 1.2133-.3466 2.7126-.52 4.498-.52 1.664 0 3.0593.1474 4.186.442 1.144.2947 2.0106.78 2.6 1.456.5893.676.884 1.5774.884 2.704v5.746c0 .312.0606.5634.182.754.1386.1734.364.26.676.26h1.352v2.496c-.208.0867-.5547.182-1.04.286-.4854.1214-1.0227.182-1.612.182-.7974 0-1.43-.0953-1.898-.286-.4507-.1733-.78-.416-.988-.728-.208-.3293-.3554-.6846-.442-1.066h-.208c-.4854.4334-1.066.806-1.742 1.118-.6587.312-1.378.546-2.158.702-.78.1734-1.612.26-2.496.26zm1.066-2.886c.4853 0 1.0226-.052 1.612-.156.6066-.1213 1.1873-.286 1.742-.494.5546-.2253 1.0053-.5026 1.352-.832.3466-.3293.52-.728.52-1.196v-.728c-1.8547 0-3.38.0694-4.576.208-1.196.1387-2.0887.3554-2.678.65-.5894.2947-.884.7107-.884 1.248 0 .364.1386.6414.416.832.2946.1734.6673.2947 1.118.364.4506.0694.91.104 1.378.104z"/><path d="m100.628 33.312c-1.0224 0-2.0018-.0866-2.9378-.26-.936-.156-1.7766-.3986-2.522-.728-.728-.3293-1.3086-.7626-1.742-1.3-.4333-.5373-.65-1.17-.65-1.898 0-.0866 0-.1646 0-.234.0174-.0693.0347-.1386.052-.208h4.16c0 .0347-.0086.078-.026.13v.13c0 .3987.1734.7194.52.962.3467.2427.7974.4247 1.352.546.572.104 1.1788.156 1.8198.156.607 0 1.196-.0346 1.768-.104.59-.0693 1.075-.1993 1.456-.39.382-.208.572-.52.572-.936s-.225-.7193-.676-.91c-.45-.1906-1.083-.3293-1.898-.416-.797-.104-1.733-.234-2.8078-.39-.8146-.1213-1.5773-.2773-2.288-.468-.6933-.1906-1.3086-.4333-1.846-.728-.52-.312-.9273-.7106-1.222-1.196-.2946-.4853-.442-1.0833-.442-1.794 0-.7626.182-1.4126.546-1.95.364-.5546.8754-1.0053 1.534-1.352.676-.3466 1.482-.598 2.418-.754s1.9674-.234 3.0938-.234c.988 0 1.916.078 2.782.234.884.156 1.656.3987 2.314.728.659.3294 1.179.7367 1.56 1.222.382.4854.572 1.0487.572 1.69v.208c0 .0694-.008.13-.026.182h-4.16v-.13c0-.3466-.147-.624-.442-.832-.294-.208-.676-.3553-1.144-.442-.468-.104-.97-.156-1.508-.156-.19 0-.476.0087-.8578.026-.3813.0174-.78.0607-1.196.13-.3986.0694-.7366.182-1.014.338-.2773.156-.416.3814-.416.676 0 .364.2167.6327.65.806.4334.1734.9967.3034 1.69.39.7108.0867 1.4738.182 2.2878.286.867.104 1.69.234 2.47.39.798.156 1.5.39 2.106.702.624.2947 1.11.702 1.456 1.222.347.52.52 1.196.52 2.028 0 .8667-.182 1.6034-.546 2.21-.364.5894-.892 1.066-1.586 1.43-.676.3467-1.508.598-2.496.754-.97.156-2.054.234-3.25.234z"/><path d="m116.946 33.312c-1.058 0-1.933-.13-2.626-.39-.676-.2773-1.179-.7366-1.508-1.378-.33-.6586-.494-1.5513-.494-2.678v-6.604h-2.652v-2.964h2.782l.806-4.056h3.12v4.056h3.77v2.964h-3.77v6.084c0 .6587.121 1.1614.364 1.508.26.3294.806.494 1.638.494h1.768v2.522c-.243.0867-.564.1647-.962.234-.382.0694-.78.1214-1.196.156-.399.0347-.746.052-1.04.052z"/><path d="m122.529 17.192v-3.016h4.056v3.016zm0 15.808v-13.702h4.056v13.702z"/><path d="m137.763 33.312c-1.803 0-3.354-.26-4.654-.78-1.283-.5373-2.271-1.3346-2.964-2.392-.693-1.0746-1.04-2.4093-1.04-4.004 0-1.5946.347-2.9206 1.04-3.978.693-1.0573 1.681-1.846 2.964-2.366 1.3-.5373 2.851-.806 4.654-.806 1.127 0 2.184.1214 3.172.364 1.005.2254 1.881.5807 2.626 1.066.745.468 1.326 1.0574 1.742 1.768.416.7107.624 1.5427.624 2.496h-4.108c0-.5893-.182-1.0833-.546-1.482-.364-.3986-.858-.702-1.482-.91-.607-.2253-1.283-.338-2.028-.338-.953 0-1.759.156-2.418.468s-1.161.7627-1.508 1.352c-.347.572-.52 1.274-.52 2.106v.52c0 .8147.173 1.5167.52 2.106.364.5894.884 1.0487 1.56 1.378.693.312 1.534.468 2.522.468.728 0 1.395-.1126 2.002-.338.624-.2426 1.118-.572 1.482-.988.381-.416.572-.8926.572-1.43h3.952c0 .9707-.217 1.82-.65 2.548-.416.7107-.997 1.3-1.742 1.768-.728.468-1.595.8234-2.6 1.066-.988.2254-2.045.338-3.172.338z"/><path d="m152.483 33-5.72-13.702h4.368l2.418 6.526c.139.3814.269.754.39 1.118.122.364.226.702.312 1.014.104.2947.174.5374.208.728h.208c.052-.1906.122-.4333.208-.728.104-.2946.217-.624.338-.988.122-.364.243-.7366.364-1.118l2.184-6.552h4.524l2.184 6.552c.052.1387.122.3814.208.728.104.3294.208.6847.312 1.066.122.364.234.7107.338 1.04h.208c.07-.2773.156-.5893.26-.936.122-.364.243-.7106.364-1.04.122-.3466.217-.6326.286-.858l2.392-6.552h4.082l-5.72 13.702h-4.03l-2.132-6.24c-.121-.3986-.251-.7973-.39-1.196-.138-.416-.268-.806-.39-1.17-.121-.364-.216-.6586-.286-.884h-.182c-.086.26-.199.5807-.338.962-.121.364-.242.754-.364 1.17-.121.3987-.242.78-.364 1.144l-2.08 6.214z"/><path d="m179.388 33.312c-.832 0-1.603-.0693-2.314-.208-.711-.1213-1.335-.3293-1.872-.624-.537-.312-.962-.728-1.274-1.248-.295-.52-.442-1.1786-.442-1.976 0-1.092.303-1.95.91-2.574.607-.6413 1.456-1.1006 2.548-1.378 1.109-.2773 2.401-.4506 3.874-.52 1.491-.0866 3.111-.13 4.862-.13v-.494c0-.572-.139-1.0226-.416-1.352-.277-.3293-.702-.5633-1.274-.702-.555-.156-1.283-.234-2.184-.234-.676 0-1.3.052-1.872.156-.555.0867-.997.234-1.326.442-.329.1907-.494.442-.494.754v.26h-4.082c-.017-.0693-.035-.13-.052-.182 0-.0693 0-.1473 0-.234 0-.8146.303-1.5253.91-2.132.607-.624 1.508-1.1006 2.704-1.43 1.213-.3466 2.713-.52 4.498-.52 1.664 0 3.059.1474 4.186.442 1.144.2947 2.011.78 2.6 1.456s.884 1.5774.884 2.704v5.746c0 .312.061.5634.182.754.139.1734.364.26.676.26h1.352v2.496c-.208.0867-.555.182-1.04.286-.485.1214-1.023.182-1.612.182-.797 0-1.43-.0953-1.898-.286-.451-.1733-.78-.416-.988-.728-.208-.3293-.355-.6846-.442-1.066h-.208c-.485.4334-1.066.806-1.742 1.118-.659.312-1.378.546-2.158.702-.78.1734-1.612.26-2.496.26zm1.066-2.886c.485 0 1.023-.052 1.612-.156.607-.1213 1.187-.286 1.742-.494.555-.2253 1.005-.5026 1.352-.832.347-.3293.52-.728.52-1.196v-.728c-1.855 0-3.38.0694-4.576.208-1.196.1387-2.089.3554-2.678.65-.589.2947-.884.7107-.884 1.248 0 .364.139.6414.416.832.295.1734.667.2947 1.118.364.451.0694.91.104 1.378.104z"/><path d="m193.243 33v-13.702h3.276l.286 2.366h.208c.226-.5026.529-.9533.91-1.352.399-.416.867-.7366 1.404-.962.538-.2426 1.144-.364 1.82-.364.312 0 .624.026.936.078.312.0347.598.0954.858.182v3.406h-2.002c-.658 0-1.222.1127-1.69.338-.45.208-.823.5027-1.118.884-.277.364-.485.78-.624 1.248-.138.4507-.208.9274-.208 1.43v6.448z"/><path d="m212.443 33.312c-1.82 0-3.389-.2513-4.706-.754-1.318-.52-2.34-1.3086-3.068-2.366-.711-1.0573-1.066-2.4006-1.066-4.03 0-1.5946.346-2.9206 1.04-3.978.71-1.0746 1.716-1.872 3.016-2.392 1.317-.5373 2.86-.806 4.628-.806 1.854 0 3.423.26 4.706.78 1.282.52 2.253 1.2914 2.912 2.314.658 1.0227.988 2.288.988 3.796v1.196h-13.026c.052.7974.268 1.4474.65 1.95.381.4854.91.8407 1.586 1.066.693.2254 1.499.338 2.418.338.416 0 .849-.0433 1.3-.13.468-.104.901-.2426 1.3-.416.416-.1733.762-.39 1.04-.65.277-.2773.433-.6066.468-.988h4.16c0 .728-.191 1.404-.572 2.028-.382.624-.936 1.1614-1.664 1.612-.728.4507-1.612.806-2.652 1.066-1.023.2427-2.176.364-3.458.364zm-4.55-8.71h8.658c0-.4506-.104-.8406-.312-1.17-.208-.3466-.512-.6326-.91-.858-.382-.2426-.824-.416-1.326-.52-.503-.1213-1.049-.182-1.638-.182-.85 0-1.604.1127-2.262.338-.642.208-1.153.52-1.534.936-.364.3987-.59.884-.676 1.456z"/></g></svg>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/sandbox"
              className="px-4 py-2 text-sm font-medium text-charcoal-200 hover:text-cream-100 transition-colors"
            >
              Sandbox
            </Link>
            <Link
              to="/mock-shop"
              className="px-4 py-2 text-sm font-medium text-charcoal-200 hover:text-cream-100 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-semibold bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
       
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-3xl space-y-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-accent-300 bg-accent-500/10 rounded-full border border-accent-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              Live Support Demo
            </span>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              The show never stops.
              <br />
              <span className="text-accent-500">Neither does your support.</span>
            </h1>
            <p className="text-xl text-charcoal-300 leading-relaxed max-w-2xl">
              Elasticware pairs an AI assistant with your human agents in a single
              live conversation. Watch a bot handle the crowd and hand off to a
              person the moment it matters — all in real time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/sandbox"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all hover:scale-[1.02] focus-ring"
              >
                Enter the Sandbox
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/mock-shop"
                className="inline-flex items-center gap-2 px-8 py-4 text-cream-100 font-semibold rounded-xl border border-charcoal-600 hover:border-charcoal-400 hover:bg-charcoal-800 transition-colors focus-ring"
              >
                Visit the Mock Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-charcoal-700 bg-charcoal-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              The Handover Loop
            </h2>
            <p className="text-charcoal-400 max-w-xl mx-auto">
              Four steps from question to resolution. The customer never leaves
              the chat — the AI and agent swap behind the scenes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loopSteps.map((step, i) => (
              <div
                key={step.num}
                className="relative group animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="bg-charcoal-800 border border-charcoal-700 rounded-2xl p-6 h-full hover:border-charcoal-500 transition-colors">
                  <span
                    className={`font-mono text-2xl font-bold ${
                      step.color === "accent"
                        ? "text-accent-500"
                        : "text-teal-500"
                    }`}
                  >
                    {step.num}
                  </span>
                  <h3 className="font-heading text-lg font-semibold mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < loopSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-charcoal-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12 space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">
            See it in action
          </h2>
          <p className="text-charcoal-400">
            Three ways to explore the demo — pick your starting point.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/sandbox"
            className="group bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 hover:border-accent-500/50 transition-all hover:scale-[1.02] animate-fade-in"
          >
            <svg fill="none" height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg">
  <g fill="#fff">
    <path d="m0 6c10.1433 9.4404 25.8567 9.4404 36 0-9.4404 10.1433-9.4404 25.8567 0 36-10.1433-9.4404-25.8567-9.4404-36 0 9.44041-10.1433 9.44041-25.8567 0-36z"/>
  </g>
</svg>

            <h3 className="font-heading text-xl font-semibold mb-2">
              The Sandbox
            </h3>
            <p className="text-sm text-charcoal-400 leading-relaxed mb-4">
              See the shop and agent dashboard side-by-side. Watch the handover
              happen live.
            </p>
            <span className="text-sm font-semibold text-accent-400 group-hover:text-accent-300 inline-flex items-center gap-1">
              Open split view
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>

          <Link
            to="/mock-shop"
            className="group bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 hover:border-accent-500/50 transition-all hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: "80ms" }}
          >
            <div className="w-10 h-10 rounded-lg mb-4 bg-cream-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="font-display text-sm text-charcoal-800">S</span>
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">
              Mock Shop
            </h3>
            <p className="text-sm text-charcoal-400 leading-relaxed mb-4">
              Browse a fake storefront and open the chat widget to talk to
              a bot.
            </p>
            <span className="text-sm font-semibold text-accent-400 group-hover:text-accent-300 inline-flex items-center gap-1">
              Visit the shop
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="group bg-charcoal-800 border border-charcoal-700 rounded-2xl p-8 hover:border-accent-500/50 transition-all hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: "160ms" }}
          >
            <div className="w-10 h-10 rounded-lg mb-4 bg-teal-500/20 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="w-3 h-3 rounded-full bg-teal-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">
              Agent Dashboard
            </h3>
            <p className="text-sm text-charcoal-400 leading-relaxed mb-4">
              Step into the agent's seat. View the ticket queue and message
              threads.
            </p>
            <span className="text-sm font-semibold text-accent-400 group-hover:text-accent-300 inline-flex items-center gap-1">
              Open dashboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-charcoal-700 text-2xl font-bold">
        <div className="text-center px-4 sm:px-6 py-8">
        <h1>Built by <a className="hover:underline" href="https://github.com/Alexandredark-glitch" target="blank">Fortunat Hitantsoa Alexandre</a></h1>
        </div>
      </footer>
    </div>
  );
}
